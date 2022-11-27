<?php

namespace App\Exports;

use App\Models\Pegawai;
use Illuminate\View\View;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
// use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ExportPegawai implements WithStyles, FromView, ShouldAutoSize, WithTitle
{
  protected $dataparsing;
  public function __construct($data)
  {
    // dd(count($customer_invs));
    $this->dataparsing = $data;
  }

  public function styles(Worksheet $sheet)
  {
    return [
      // Style the first row as bold text.
      1    => ['font' => ['bold' => true]],
      2    => ['font' => ['bold' => true]],
    ];
  }

  // public function columnFormats(): array
  // {
  //   return [
  //     'C' => NumberFormat::FORMAT_NUMBER,
  //   ];
  // }

  public function title(): string
  {
    return 'Laporan Pegawai - ' . date('Y-m');
  }

  public function view(): View
  {
    return view('exports.pegawai', [
      'data' => $this->dataparsing,
    ]);
  }
}
