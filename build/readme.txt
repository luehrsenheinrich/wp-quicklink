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

Use these carefully crafted blocks to create stunning content on your Gutenberg enabled WordPress website. These blocks a built as versitile as possible and are fully compatible to the official Twenty Ninteen theme and work fine in all the other Twenty X themes.

#### ▶️ Available Blocks

**✅ Split - [Block Demo](https://blocks.wp-munich.com/blocks/split/?utm_source=wporg&utm_medium=plugin_repo&utm_campaign=readme)**
Display feature presentations or a visually appealing list of things with multiple split blocks in a row. You can set an image on one side and text on the other side. Use the center image to create an 'image in image' effect to display important images.

**✅ Background - [Block Demo](https://blocks.wp-munich.com/blocks/background/?utm_source=wporg&utm_medium=plugin_repo&utm_campaign=readme)**
Create colorful and interesting backgrounds with the background block. The block acts as a wrapper for other blocks and you can define background and text color, a background image and width of the background. Works best in full width enabled themes.

**✅ Event - [Block Demo](https://blocks.wp-munich.com/blocks/event/?utm_source=wporg&utm_medium=plugin_repo&utm_campaign=readme)**
Quickly create a description of an event you're writing about. The block also generates the needed structured data for Google to [show event details in the search results](https://developers.google.com/search/docs/data-types/event).

**✅ Accordion - [Block Demo](https://blocks.wp-munich.com/blocks/accordion/?utm_source=wporg&utm_medium=plugin_repo&utm_campaign=readme)**
Use this block to provide a well structured piece of content. You can use this for FAQ sections and contnent you don't want to be initially visible.

**✅ RSS - [Block Demo](https://blocks.wp-munich.com/blocks/rss-2/?utm_source=wporg&utm_medium=plugin_repo&utm_campaign=readme)**
Syndicate content from all over the web and quickly create an index of fresh content.

**✅ Person - [Block Demo](https://blocks.wp-munich.com/blocks/person/?utm_source=wporg&utm_medium=plugin_repo&utm_campaign=readme)**
A beautiful block to present your team members or other kinds of people.

#### ▶️ Additional Features

**✅ No Margin Bottom - [Demo](https://blocks.wp-munich.com/additional-features/?utm_source=wporg&utm_medium=plugin_repo&utm_campaign=readme)**
A control for every block to remove the bottom margin. That makes stacking blocks possible.

**✅ Image Filters - [Demo](https://blocks.wp-munich.com/additional-features/image-filters/?utm_source=wporg&utm_medium=plugin_repo&utm_campaign=readme)**
A set of filters for the core image and gallery blocks and our split block to add beautiful color effects to the images.

== Installation ==

#### From within WordPress

1. Visit 'Plugins > Add New'
1. Search for 'WP Munich Blocks'
1. Activate WP Munich Blocks from your Plugins page.

#### Manually

1. Upload the `wp-munich-blocks` folder to the `/wp-content/plugins/` directory
1. Activate the WP Munich Blocks plugin through the 'Plugins' menu in WordPress

== Screenshots ==

1. Split Block: A block to show an image on one side and text on the other side.
2. Background Block: A block to style the background behind a number of other blocks.
3. Event Block: Display an event with the needed meta information and provide Google with structured data about that event.
4. No Margin Bottom: Remove the bottom margin from every block to stack them.

== Changelog ==

= 0.5.0 =
* Added the person block

= 0.4.2 =
* Fixed some issues with the styling of RSS blocks

= 0.4.1 =
* Minor bug fix

= 0.4.0 =
* Added the RSS block
* Updated the i18n handling

= 0.3.0 =
* Added the accordion block
* Fixed an issue with parallax images not updating position (thanks oguido)
* Updated general compatibility with twentynineteen

= 0.2.1 =
* Fixed a typo in an image filters
* Added a deprecation for the event block

= 0.2.0 =
* Added the image filter tool
* Fixed an issue with event blocks not validating right upon immediately saving

= 0.1.0 =
* Celebrate the launch of WordPress 5.0
* Fix the asset loading for block styles

= 0.0.14 =
- Minor Fixes
- Updated the readme

= 0.0.13 =
- Parallax Effect: Fixed some issues on mobile

= 0.0.12 =
- Split Block: Added a parallax feature
- Background Block: Added a parallax feature
- Event Block: Added a block to display basic information about an event and create fitting JSON-LD markup for Google.

= 0.0.11 =
- Split Block: Fixed the visibility of the center block without a background image

= 0.0.10 =
- Split Block: Added the ability to set the center image without a background image
- Split Block: Added the ability to set the mobile image position
- Background Block: Fixed an issue with nested blocks with wide alignment

= 0.0.9 =
- Fixed a dependency issue with Gutenberg

= 0.0.8 =
- Add the no bottom margin control
- Split Block: Fixed a bug with safari

= 0.0.7 =
- Add the backgorund block
- Add the split block
- Initial Release
