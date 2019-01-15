=== <##= pkg.title ##> ===

Contributors: wpmunich, luehrsen
Tags: <##= pkg.tags ##>
Requires at least: <##= pkg.minWpReq ##>
Tested up to: <##= pkg.testedWp ##>
Requires PHP: 5.6
Stable tag: <##= pkg.version ##>
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

<##= pkg.shortDesc ##>

== Description ==

Quicklink for WordPress attempts to make navigation to subsequent pages load faster. Embedded with the plugin is a javascript library, which detects links in the viewport, waits until the browser is idle and prefetches the URLs for these links. The library also tries to detect, if the user is on a slow connection or on a data plan.

This plugin builds heavily on the amazing work done by [Google Chrome Labs](https://github.com/GoogleChromeLabs/quicklink).

== Installation ==

#### From within WordPress

1. Visit 'Plugins > Add New'
1. Search for 'WP Munich Blocks'
1. Activate WP Munich Blocks from your Plugins page.

#### Manually

1. Upload the `wp-munich-blocks` folder to the `/wp-content/plugins/` directory
1. Activate the WP Munich Blocks plugin through the 'Plugins' menu in WordPress

== Changelog ==

= 0.1.0 =
* Initial release
