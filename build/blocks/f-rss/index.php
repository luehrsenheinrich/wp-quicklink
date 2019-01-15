<?php
/**
 * Server-side rendering of the `wpm/rss` block.
 *
 * @see http://simplepie.org/wiki/reference/start#simplepie_item
 * @package gutenberg
 */

/**
 * Renders the `wpm/rss` block on server.
 *
 * @param   array $attributes  The block attributes.
 * @return  string             Returns the post content with latest posts added.
 */
function wpm_render_block_f_rss( $attributes ) {
	$block_content = '';

	$feed_url    = isset( $attributes['url'] ) && ! empty( $attributes['url'] ) ? esc_url( $attributes['url'] ) : null;
	$item_amount = isset( $attributes['amount'] ) && ! empty( $attributes['amount'] ) ? intval( $attributes['amount'] ) : 4;
	$feed_colors = array(
		'background_color'        => isset( $attributes['backgroundColor'] ) ? $attributes['backgroundColor'] : '',
		'text_color'              => isset( $attributes['textColor'] ) ? $attributes['textColor'] : '',
		'custom_background_color' => isset( $attributes['customBackgroundColor'] ) ? $attributes['customBackgroundColor'] : '',
		'custom_text_color'       => isset( $attributes['customTextColor'] ) ? $attributes['customTextColor'] : '',
	);
	$columns     = isset( $attributes['columns'] ) && ! empty( $attributes['columns'] ) ? $attributes['columns'] : '2';

	if ( $feed_url ) :
		$feed = fetch_feed( $feed_url );

		if ( is_wp_error( $feed ) ) {
			// The feed provided is not valid. Display error message.
			// Start buffered output.
			ob_start();
			?>
				<p>
					<?php esc_html_e( 'RSS Block Error: This does not seem to be a valid feed.', 'wp-munich-blocks' ); ?>
				</p>
			<?php

			return ob_get_clean();
		}

		$maxitems = $feed->get_item_quantity( $item_amount );

		// Build an array of all the items, starting with element 0 (first element).
		$rss_items = $feed->get_items( 0, $maxitems );

		// Check if we got RSS items.
		if ( count( $rss_items ) > 0 ) :
			$wp_date_format = get_option( 'date_format' );

			// Handle block styles and classes depending if on front- or backend.
			if ( defined( 'REST_REQUEST' ) && true === REST_REQUEST ) {
				// Backend.
				// Handle block classnames.
				$block_classes = class_names(
					'wp-block-wpm-rss',
					array(
						"has-{$feed_colors['background_color']}-background-color" => ! empty( $feed_colors['background_color'] ),
						"has-{$feed_colors['text_color']}-color" => ! empty( $feed_colors['text_color'] ),
						"has-{$columns}-cols" => true,
					)
				);

				// Handle block styles.
				$block_styles = class_names(
					array(
						"background-color:{$feed_colors['background_color']};" => ! empty( $feed_colors['background_color'] ),
						"color:{$feed_colors['text_color']};" => ! empty( $feed_colors['text_color'] ),
					)
				);
			} else {
				// Frontend.
				// Handle block classnames.
				$block_classes = class_names(
					'wp-block-wpm-rss',
					array(
						"has-{$feed_colors['background_color']}-background-color" => ! empty( $feed_colors['background_color'] ),
						"has-{$feed_colors['text_color']}-color" => ! empty( $feed_colors['text_color'] ),
						"has-{$columns}-cols" => true,
					)
				);

				// Handle block styles.
				$block_styles = class_names(
					array(
						"background-color:{$feed_colors['custom_background_color']};" => ! empty( $feed_colors['custom_background_color'] ),
						"color:{$feed_colors['custom_text_color']};" => ! empty( $feed_colors['custom_text_color'] ),
					)
				);
			}

			// Start buffered output.
			ob_start();
			?>
			<div class="<?php echo esc_attr( $block_classes ); ?>" <?php echo wp_kses_post( empty( $block_styles ) ? : "style=\"{$block_styles}\"" ); ?>>

				<?php
				$count = count( $rss_items );

				for ( $i = 0; $i < $count; $i++ ) {
					$rss_item = array(
						'id'        => $rss_items[ $i ]->get_id(),
						'title'     => $rss_items[ $i ]->get_title(),
						'date'      => strtotime( $rss_items[ $i ]->get_date() ),
						'author'    => $rss_items[ $i ]->get_author(),
						'permalink' => $rss_items[ $i ]->get_permalink(),
						'excerpt'   => $rss_items[ $i ]->get_description(),
						'thumbnail' => $rss_items[ $i ]->get_enclosure()->get_thumbnail(),
					);
					?>
					<article id="<?php echo esc_attr( md5( $rss_item['id'] ) ); ?>" class="wpm-rss-item">
						<?php if ( ! empty( $rss_item['thumbnail'] ) ) : ?>
							<div class="wpm-rss-thumbnail">
								<?php echo wp_kses_post( $rss_item['thumbnail'] ); ?>
							</div>
						<?php endif; ?>

						<?php if ( ! empty( $rss_item['date'] ) || ! empty( $rss_item['author'] ) ) : ?>
							<p class="wpm-rss-metainfo">
								<i class="wpm-rss-icon" aria-label="RSS Icon"><?php include WPM_BLOCKS_PATH . 'inc/icons/icon-rss.php'; ?></i>

								<?php if ( ! empty( $rss_item['date'] ) ) : ?>
									<time datetime="<?php echo esc_attr( 'Y-m-d H:i', $rss_item['date'] ); ?>">
										<?php echo esc_attr( date( $wp_date_format, $rss_item['date'] ) ); ?>
									</time>
								<?php endif; ?>

								<?php if ( ! empty( $rss_item['author'] ) ) : ?>
									<span class="wpm-rss-author">
										<?php
										// translators: info which author wrote the article.
										echo esc_attr( sprintf( _x( 'by %1$s', 'by {authorname}', 'wp-munich-blocks' ), $rss_item['author']->get_name() ) );
										?>
									</span>
								<?php endif; ?>
							</p>
						<?php endif; ?>

						<h3 class="wpm-rss-title"><a href="<?php echo esc_url( $rss_item['permalink'] ); ?>" class="wpm-rss-permalink"><?php echo esc_attr( $rss_item['title'] ); ?></a></h3>

						<div class="wpm-rss-excerpt">
							<?php echo wp_kses_post( wpautop( $rss_item['excerpt'] ) ); ?>
						</div>
					</article>
					<?php
				};
				?>

			</div>
			<?php
			$block_content = ob_get_clean();
		endif;
	endif;

	return $block_content;
}
