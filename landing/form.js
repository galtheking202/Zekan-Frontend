document.getElementById('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  if (!email) return;

  const btn = e.target.querySelector('.submit-btn');
  btn.disabled = true;
  btn.textContent = '...';

  try {
    const res = await fetch('https://server-lowcost.up.railway.app/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!res.ok && res.status !== 409) throw new Error('server');

    e.target.style.display = 'none';
    document.getElementById('success').style.display = 'flex';
  } catch {
    btn.disabled = false;
    btn.textContent = 'עדכנו אותי!';
  }
});
