<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWipsTable extends Migration
{
    public function up()
    {
        Schema::create('wips', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sku_id')->constrained()->onDelete('cascade');
            $table->string('wip_code')->unique();
            $table->integer('batch_size');
            $table->string('status');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('wips');
    }
}