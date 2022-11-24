<?php

namespace App\Exports;

use App\Models\Absen;
use Illuminate\View\View;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ExportAbsen implements WithStyles, FromView, ShouldAutoSize, WithTitle
{
  protected $dataparsing;
  public function __construct($data)
  {
    // dd(count($customer_invs));
    $this->dataparsing = $data;
  }

  public function registerEvents(): array
    {
        $alphabetRange = range('A', 'Z');
        $alphabet = $alphabetRange[$this->totalValue + 6]; // returns Alphabet

        // $totalRow       = (count($this->attributeSets) * 3) + count($this->allItems) + 1;
        $cellRange      = 'B6:G7';

        return [
            AfterSheet::class    => function (AfterSheet $event) use ($cellRange) {
                $event->sheet->getDelegate()->getStyle($cellRange)
                    ->getAlignment()
                    ->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_TOP);
            },
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            // Style the first row as bold text.
            1    => ['font' => ['bold' => true]],
            2    => ['font' => ['bold' => true]],
        ];
    }

  public function title(): string
  {
    return 'Laporan Absensi - di cetak pada '.date('Y-m-d');
  }

  public function view(): View
  {
    return view('exports.absensi', [
      'data' => $this->dataparsing,
    ]);
  }
}
