<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Aktivnost extends Model
{
    use HasFactory;

    protected $fillable = [
        'naziv',
        'datum',
        'tip', // Sezonska ili prilagođena
        'opis',
      
        'kosnica_id',
        'user_id',
    ];

    public function kosnica()
    {
        return $this->belongsTo(Kosnica::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
