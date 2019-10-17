<?php

$algo = 'sha384';
$hash = hash_file($algo, __DIR__ . '/../loader.min.js', true);
$b64  = base64_encode($hash);

$filepath = realpath(__DIR__ . '/../README.md');
$old      = file_get_contents($filepath);
$new      = preg_replace('(integrity="\\K[^"]*+)', $algo . '-' . $b64, $old, -1, $cnt);

if (!$cnt)
{
	die("Could not patch $filepath\n");
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