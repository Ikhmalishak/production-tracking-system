<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ScanRecord extends Model
{
    protected $fillable = ['serial_id', 'sku_id', 'wip_id', 'scan_number', 'scanned_at'];

    public function sku(): BelongsTo
    {
        return $this->belongsTo(Sku::class);
    }

    public function wip(): BelongsTo
    {
        return $this->belongsTo(Wip::class);
    }
}