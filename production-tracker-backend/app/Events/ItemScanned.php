<?php

namespace App\Events;

use App\Models\ScanEvent;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ItemScanned implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $scanEvent;

    /**
     * Create a new event instance.
     */
    public function __construct(ScanEvent $scanEvent)
    {
        $this->scanEvent = $scanEvent;
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('production'),
            new PrivateChannel('production.'.$this->scanEvent->production_line_id),
        ];
    }
    
    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'id' => $this->scanEvent->id,
            'barcode' => $this->scanEvent->barcode,
            'production_line_id' => $this->scanEvent->production_line_id,
            'scanned_at' => $this->scanEvent->scanned_at,
            'operator' => $this->scanEvent->user->name,
        ];
    }
}