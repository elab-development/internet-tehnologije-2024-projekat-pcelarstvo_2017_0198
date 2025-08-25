<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ObavestiPcelara extends Mailable
{
    use Queueable, SerializesModels;
    public $aktivnost;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($aktivnost)
    {
        $this->aktivnost = $aktivnost;
    }

    public function build()
    {
        return $this->subject('Nova aktivnost za Vašu košnicu')
            ->view('emails.obavesti_pcelara');
    }
}
