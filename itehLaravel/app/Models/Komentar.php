<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Komentar extends Model
{
    use HasFactory;

    protected $fillable = [
        'sadrzaj',
        'datum',
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
