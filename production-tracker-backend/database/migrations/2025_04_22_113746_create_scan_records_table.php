<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateScanRecordsTable extends Migration
{
    public function up()
    {
        Schema::create('scan_records', function (Blueprint $table) {
            $table->id();
            $table->string('serial_id')->unique();
            $table->foreignId('sku_id')->constrained()->onDelete('cascade');
            $table->foreignId('wip_id')->constrained()->onDelete('cascade');
            $table->integer('scan_number');
            $table->timestamp('scanned_at');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('scan_records');
    }
}