<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Wip extends Model
{
    protected $fillable = ['sku_id', 'wip_code', 'batch_size', 'status'];

    public function sku(): BelongsTo
    {
        return $this->belongsTo(Sku::class);
    }

    public function scanRecords(): HasMany
    {
        return $this->hasMany(ScanRecord::class);
    }
}