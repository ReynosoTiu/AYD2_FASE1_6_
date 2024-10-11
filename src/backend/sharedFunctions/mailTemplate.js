
export function getMailTemplate(conn) {
    let template = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenido a qnave</title>
  <style>
    body {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      background: linear-gradient(to right, #4e54c8, #8f94fb);
      font-family: Arial, sans-serif;
    }

    .container {
      background: #ffffff;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      text-align: center;
      max-width: 400px;
      width: 90%;
    }

    .title {
      font-size: 2em;
      font-weight: bold;
      margin-bottom: 16px;
      color: #333;
    }

    .subtitle {
      font-size: 1.1em;
      margin-bottom: 16px;
      color: #555;
    }

    .password-box {
      background: #f4f4f4;
      padding: 10px;
      border-radius: 8px;
      display: inline-block;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .password {
      font-family: monospace;
      font-size: 1.5em;
      color: #333;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1 class="title">Bienvenido a qnave</h1>
    <p class="subtitle">Tu contraseña temporal es:</p>
    <div class="password-box">
      <span class="password">${conn}</span>
    </div>
  </div>
</body>
</html>

`;
    return template
}


