require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const web = express();
const PORT = 3000;
const upload = multer({ dest: 'uploads/' });
web.use(express.static('public'));
web.use('/uploads', express.static('uploads'));
web.use(express.urlencoded({ extended: true }));
web.use(express.json());
web.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/HTML/CV-creator-website-home-page.html');
});
web.get('/designs', (req, res) => {
  res.sendFile(__dirname + '/public/HTML/CV-creator-website-designes-page.html');
});
web.get('/suggestion', (req, res) => {
  res.sendFile(__dirname + '/public/HTML/CV-creator-website-suggestion-page.html');
});
web.get('/staff', (req, res) => {
  res.sendFile(__dirname + '/public/HTML/CV-creator-website-staff-page.html');
});
web.post('/suggest-template', upload.single('template'), async (req, res) => {
  try {
    const contact = req.body.contact;
    const fileBuffer = fs.readFileSync(req.file.path);
    const fileName = `${Date.now()}-${req.file.originalname}`;
    const { error: uploadError } = await supabase.storage
      .from('submissions')
      .upload(fileName, fileBuffer, {
        contentType: req.file.mimetype
      });
    if (uploadError) {
      throw uploadError;
    }
    const { error: dbError } = await supabase
      .from('submissions')
      .insert({
        contact: contact,
        file_path: fileName,
        original_name: req.file.originalname,
        file_size: req.file.size,
        mime_type: req.file.mimetype,
        ip_address: req.ip,
        status: 'pending'
      });
    if (dbError) {
      throw dbError;
    }
    fs.unlinkSync(req.file.path);
    res.send(
      "کڵێشەکەت بە سەرکەوتوویی نێردرا. بەم زووانە وەڵام دەدرێتەوە."
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("Upload failed.");
  }
});
web.get('/api/submissions', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      throw error;
    }
    const submissionsWithUrls = await Promise.all(
      data.map(async (submission) => {
        const { data: signedUrlData, error: signedUrlError } =
          await supabase.storage
            .from('submissions')
            .createSignedUrl(
              submission.file_path,
              60 * 60
            );
        if (signedUrlError) {
          console.error(signedUrlError);
        }
        return {
          ...submission,
          download_url: signedUrlData?.signedUrl || null
        };
      })
    );
    res.json(submissionsWithUrls);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Could not load submissions"
    });
  }
});
web.get('/admin', (req, res) => {
  res.sendFile(
    __dirname + '/public/HTML/CV-creator-website-admin-page.html'
  );
});
web.post('/accept-template', async (req, res) => {
  try {
    const id = req.body.id;
    const { error } = await supabase
      .from('submissions')
      .update({
        status: 'accepted'
      })
      .eq('id', id);
    if (error) {
      throw error;
    }
    res.json({
      success: true
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false
    });
  }
});
web.post('/reject-template', async (req, res) => {
  try {
    const id = req.body.id;
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      throw error;
    }
    await supabase.storage
      .from('submissions')
      .remove([
        data.file_path
      ]);
    await supabase
      .from('submissions')
      .delete()
      .eq('id', id);
    res.json({
      success: true
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false
    });
  }
});
web.get('/download/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { data: submission, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      throw error;
    }
    const { data: fileData, error: fileError } = await supabase.storage
      .from('submissions')
      .download(submission.file_path);
    if (fileError) {
      throw fileError;
    }
    const buffer = Buffer.from(await fileData.arrayBuffer());
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${submission.original_name}"`
    );
    res.setHeader(
      'Content-Type',
      submission.mime_type
    );
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(404).send('File not found');
  }
});
web.get('/test-supabase', async (req, res) => {
  const { data, error } = await supabase
    .from('submissions')
    .select('*');
  if (error) {
    return res.json(error);
  }
  res.json(data);
});
web.listen(PORT, () => {
  console.log("====================================");
  console.log("CV Creator Website is running!");
  console.log(`http://localhost:${PORT}`);
  console.log("====================================");
});