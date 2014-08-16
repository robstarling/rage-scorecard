#!/bin/sh

B64=$(base64 <<'__HTML__'
<!DOCTYPE html>
<html>
<head>
  <title>Rage Scorecard</title>
  <link rel="stylesheet" type="text/css" href="https://raw.githubusercontent.com/robstarling/rage-scorecard/master/main.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
  <script src="https://raw.githubusercontent.com/robstarling/rage-scorecard/master/main.js"></script>
</head>
<body>
  <div id="m"></div>
  <button id="bReset">Reset</button>
  (Note that the URL captures the whole game state and can be bookmarked/shared.)
</body>
</html>
__HTML__
)

echo "data:text/html;charset=utf-8;base64,${B64}"
