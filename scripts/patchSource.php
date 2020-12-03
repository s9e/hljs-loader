<?php

$version = $_SERVER['argv'][1] ?? '';
$extPath = __DIR__ . '/../ext/highlight.js/';

$map     = [];
$default = [];
foreach (glob($extPath . 'src/languages/*.js') as $filepath)
{
	$file = file_get_contents($filepath);
	$lang = basename($filepath, '.js');
	if (preg_match('(^category:\\s*common)im', $file))
	{
		// Keep track of imported syntaxes
		if (preg_match("(^import \\w+ from './([-\\w]++).js)m", $file, $m))
		{
			$default[] = $m[1];
		}

		// Skip default languages
		continue;
	}
	$map[$lang][$lang] = $lang;

	if (!preg_match('(aliases:\\s*\\[([^]]++))', $file, $m))
	{
		continue;
	}

	preg_match_all('(["\']([^ "\',.]++)["\'])', strtolower($m[1]), $m);
	foreach ($m[1] as $alias)
	{
		$map[$lang][$alias] = $alias;
	}
}
ksort($map);

// Remove imported syntaxes from default languages
foreach ($default as $lang)
{
	unset($map[$lang]);
}

foreach ($map as $lang => $aliases)
{
	// Sort aliases but make sure the canonical name remains first of the list
	unset($aliases[$lang]);
	sort($aliases);
	array_unshift($aliases, $lang);

	$map[$lang] = implode(',', $aliases);
}

// Get highlight.js version from git
if ($version === '')
{
	chdir($extPath);
	$version = exec('git tag -l --sort=version:refname | tail -n1');
}

// Update README.md
$filepath = realpath(__DIR__ . '/../README.md');
$readme = file_get_contents($filepath);
$readme = preg_replace('(highlight.js/\\K\\d+\\.\\d+\\.\\d+)', $version, $readme, -1, $cnt);
file_put_contents($filepath, $readme);

// Update loader.js
$filepath = realpath(__DIR__ . '/../loader.js');

$js = file_get_contents($filepath);
$js = preg_replace('(highlightjs/cdn-release@\\K\\d+\\.\\d+\\.\\d+)', $version, $js, -1, $cnt);
if (!$cnt)
{
	die("Cannot patch version in $filepath\n");
}

$js = preg_replace_callback(
	'(aliases\\s*=\\s*\\K.++)',
	function ($m) use ($map)
	{
		return "'" . implode(' ', $map) . "'.split(' '),";
	},
	$js,
	-1,
	$cnt
);
if (!$cnt)
{
	die("Cannot patch aliases in $filepath\n");
}

file_put_contents($filepath, $js);
die("Done.\n");