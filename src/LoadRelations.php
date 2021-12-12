<?php

namespace IanM\Synopsis;

use Flarum\Api\Controller\AbstractSerializeController;
use Flarum\Settings\SettingsRepositoryInterface;

class LoadRelations
{
    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;
    
    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }
    
    public function __invoke(AbstractSerializeController $controller)
    {
        // Only include the `lastPost` relation if we need it.
        if ($this->settings->get('ianm-synopsis.excerpt-type') === 'last') {
            $controller->addInclude('lastPost');
        }
    }
}
