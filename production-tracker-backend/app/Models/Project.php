<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    protected $fillable = ['project_code', 'name', 'description'];

    public function skus(): HasMany
    {
        return $this->hasMany(Sku::class);
    }
}