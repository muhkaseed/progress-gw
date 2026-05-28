export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const scriptUrl = req.query.scriptUrl || req.body?.scriptUrl;
  if (!scriptUrl) {
    return res.status(400).json({ success: false, error: 'scriptUrl required' });
  }

  try {
    if (req.method === 'GET') {
      // Forward semua params kecuali scriptUrl
      const params = { ...req.query };
      delete params.scriptUrl;
      const url = scriptUrl + '?' + new URLSearchParams(params).toString();
      console.log('Proxying GET:', url);
      const response = await fetch(url);
      const text = await response.text();
      // Parse JSON (bukan JSONP)
      const data = JSON.parse(text);
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const body = { ...req.body };
      delete body.scriptUrl;
      console.log('Proxying POST:', scriptUrl, body);
      const response = await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        return res.status(200).json(data);
      } catch(e) {
        return res.status(200).json({ success: true });
      }
    }
  } catch (err) {
    console.error('Proxy error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
