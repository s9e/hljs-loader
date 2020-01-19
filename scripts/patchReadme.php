<?php

$version = $_SERVER['argv'][1] ?? 'current';

$algo = 'sha384';
$file = file_get_contents(__DIR__ . '/../loader.min.js');
$hash = hash($algo, $file, true);
$b64  = base64_encode($hash);

$filepath = realpath(__DIR__ . '/../README.md');
$old      = file_get_contents($filepath);
$new      = preg_replace('(integrity="\\K[^"]*+)', $algo . '-' . $b64, $old, -1, $cnt);
if (!$cnt)
{
	die("Could not patch integrity in $filepath\n");
}

if (!preg_match('(https://[^"]++)', $file, $m))
{
	die("Could not parse highlight.js URL\n");
}
$new = preg_replace('(data-hljs-url="\\K[^"]++)', $m[0], $new, -1, $cnt);
if (!$cnt)
{
	die("Could not patch data-hljs-url in $filepath\n");
}

if ($version === 'current' || $version === 'new')
{
	$gitVersion = exec('git describe');
	if ($version === 'new')
	{
		preg_match('((\\d++)\\.(\\d++)\\.(\\d++))', $gitVersion, $m);
		$version = $m[1] . '.' . $m[2] . '.' . (1 + $m[3]);
	}
	else
	{
		$version = $gitVersion;
	}
}
$new = preg_replace('(hljs-loader@\\K\\d++\\.\\d++\\.\\d++)', $version, $new, -1, $cnt);
if (!$cnt)
{
	die("Could not patch version in $filepath\n");
}

if ($old === $new)
{
	echo "Nothing to do.\n";
}
else
{
	file_put_contents($filepath, $new);
	echo "Patched $filepath\n";
}