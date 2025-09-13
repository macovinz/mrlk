<?php

// Enqueue JS and CSS
function phsailingtheme_enqueue_assets() {
  $theme_dir = get_template_directory_uri();

  wp_enqueue_script(
    'phsailingtheme-frontend',
    $theme_dir . '/assets/index.js',
    array('wp-element', 'react-jsx-runtime'), // required for React in WP
    filemtime(get_template_directory() . '/assets/index.js'),
    true
  );

  wp_enqueue_style(
    'phsailingtheme-style',
    $theme_dir . '/assets/index.css',
    array(),
    filemtime(get_template_directory() . '/assets/index.css')
  );
}
add_action('wp_enqueue_scripts', 'phsailingtheme_enqueue_assets');

// Add theme support
function phsailingtheme_setup() {
  add_theme_support('title-tag');
  add_theme_support('post-thumbnails');
  register_nav_menus([
    'primary' => __('Primary Menu', 'phsailingtheme'),
  ]);
}
add_action('after_setup_theme', 'phsailingtheme_setup');

// Register custom post type: Crew Directory
function register_crew_post_type() {
  register_post_type('crew', [
    'label' => 'Crew Directory',
    'public' => true,
    'show_in_rest' => true, // enable for React/REST
    'supports' => ['title', 'custom-fields'],
    'menu_icon' => 'dashicons-groups',
  ]);
}
add_action('init', 'register_crew_post_type');

function register_event_post_type() {
  register_post_type('event', [
    'label' => 'Events',
    'public' => true,
    'show_in_rest' => true, // ✅ Needed for REST API
    'supports' => ['title', 'editor', 'thumbnail', 'custom-fields'],
    'menu_icon' => 'dashicons-calendar-alt',
  ]);
}
add_action('init', 'register_event_post_type');

function register_club_post_type() {
  register_post_type('club', [
    'label' => 'Clubs',
    'public' => true,
    'show_in_rest' => true, // ✅ Required for REST API
    'supports' => ['title', 'custom-fields', 'thumbnail'],
    'menu_icon' => 'dashicons-location-alt',
  ]);
}
add_action('init', 'register_club_post_type');


add_filter('acf/fields/google_map/api', function ($api) {
  $api['key'] = 'AIzaSyAF58VWmks948IZ0ioIS0o381BqFp8ws1M';
  return $api;
});


add_filter('acf/rest_api/field_settings/show_in_rest', '__return_true');

