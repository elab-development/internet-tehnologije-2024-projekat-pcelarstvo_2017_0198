<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kosnica extends Model
{
    use HasFactory;

    protected $fillable = [
        'naziv',
        'adresa',
        'opis',
        'user_id',
        'longitude',
        'latitude',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function aktivnosti()
    {
        return $this->hasMany(Aktivnost::class);
    }
}
