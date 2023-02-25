<?php

/*
 * This file is part of ianm/synopsis.
 *
 * (c) 2020 - 2022 Ian Morland
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace IanM\Synopsis;

use Flarum\Api\Controller\ListDiscussionsController;
use Flarum\Api\Controller\UpdateDiscussionController;
use Flarum\Extend;
use Flarum\Tags\Api\Serializer\TagSerializer;
use Flarum\Tags\Event\Saving as TagSaving;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/resources/less/forum/extension.less'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js'),

    new Extend\Locales(__DIR__.'/resources/locale'),

    (new Extend\Settings())
        ->default('ianm-synopsis.excerpt_length', 200)
        ->default('ianm-synopsis.rich-excerpts', false)
        ->default('ianm-synopsis.excerpt-type', 'first')
        ->serializeToForum('synopsis.excerpt_length', 'ianm-synopsis.excerpt_length', 'intVal')
        ->serializeToForum('synopsis.rich_excerpts', 'ianm-synopsis.rich-excerpts', 'boolVal')
        ->serializeToForum('synopsis.excerpt_type', 'ianm-synopsis.excerpt-type'),

    (new Extend\ApiController(ListDiscussionsController::class))
        ->prepareDataForSerialization(LoadRelations::class),


    (new Extend\User())
        ->registerPreference('showSynopsisExcerpts', 'boolVal', true),
//        ->registerPreference('showSynopsisExcerptsOnMobile', 'boolVal', false),

    (new Extend\Event())
        ->listen(TagSaving::class, Tags\Saving::class),

    (new Extend\ApiSerializer(TagSerializer::class))
        ->attributes(Tags\AddTagsAttrs::class),
];
