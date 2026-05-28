export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const scriptUrl = req.query.scriptUrl;
  if (!scriptUrl) {
    return res.status(400).json({ success: false, error: 'scriptUrl required' });
  }

  try {
    if (req.method === 'GET') {
      const params = new URLSearchParams();
      Object.entries(req.query).forEach(([k, v]) => {
        if (k !== 'scriptUrl') params.set(k, v);
      });
      const targetUrl = scriptUrl + '?' + params.toString();
      const response = await fetch(targetUrl);
      const data = await response.json();
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const response = await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
      });
      const data = await response.json();
      return res.status(200).json(data);
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
