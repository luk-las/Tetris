<html>
<head>
	<title>TETRIS</title>
	<link rel="stylesheet" href="style.css">
</head>
<body>
	<div><button type="submit" id="submitPause" onclick="pause()">PAUSE</button></div>
	<canvas id="tetris" width="200" height="400"></canvas>
	<div>
		Score: <div id="score">0</div>
		<div><button id="slow" type="submit" onclick="getTime(1000)">Slow</button></div>
		<div><button id="normal" type="submit" onclick="getTime(500)">Normal</button></div>
		<div><button id="fast" type="submit" onclick="getTime(250)">Fast</button></div>
	</div>
	<script src="tetrominoes.js"></script>
	<script src="tetris.js"></script>
</body>
</html>