=== <##= pkg.title ##> ===

Contributors: wpmunich, google, luehrsen, westonruter
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
1. Search for 'Quicklink for WordPress'
1. Activate Quicklink for WordPress from your Plugins page.

#### Manually

1. Upload the `quicklink` folder to the `/wp-content/plugins/` directory
1. Activate the Quicklink for WordPress plugin through the 'Plugins' menu in WordPress

== Changelog ==

= 0.4.0 =
* Updated the script loading to load asynchronously
* Updated the plugin assets

= 0.3.0 =
* Added compatibility with AMP
* Added amazing contributors
* Added the new WordPress filter 'quicklink_options' to modify quicklink settings

= 0.2.0 =
* Release for the plugin repository
* Tuned quicklink ignores for WordPress

= 0.1.0 =
* Initial release
