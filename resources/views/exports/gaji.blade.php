<style>
  .text-right {
      text-align: right;
  }

  .text-left {
      text-align: left;
  }

  .text-center {
      text-align: center;
  }

  .align-middle {
      vertical-align: middle;
  }

  .border-tabel {
      border: 1px solid red
  }
</style>

<table>
  <tbody>
      <tr>
          <td></td>
          <td colspan="14" style="text-align: center; font-size: 13px; font-weight: bold">LAPORAN DATA GAJI</td>
      </tr>
      <tr>
          <td></td>
          <td colspan="14" style="text-align: center"></td>
      </tr>
  </tbody>
</table>

<table>
  <thead>
      <tr>
          <th></th>
          <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">NO</th>
          <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">PERIODE</th>
          <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">NIK</th>
          <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">NAMA PEGAWAI</th>
          <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">JABATAN</th>
          <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">STATUS</th>
          <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">GAJI POKOK</th>
          <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">TUNJANGAN</th>
          <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">TOTAL HADIR</th>
          <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">TOTAL GAJI POKOK per HARI</th>
          <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">TOTAL TUNJANGAN per HARI</th>
          <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black; padding: 10">BONUS</th>
          <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">POTONGAN</th>
          <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">TOTAL GAJI</th>
      </tr>
  </thead>
  <tbody>
      @php
          $no = 1;
      @endphp
      @foreach ($data as $d)
          <tr>
              <td></td>
              <td style="border: 1px solid black">{{ $no }}</td>
              <td style="border: 1px solid black">{{ date("Y-m", substr($d->periode, 0, 10)) }}</td>
              <td style="border: 1px solid black">{{ $d->pegawai->nik }}</td>
              <td style="border: 1px solid black">{{ $d->pegawai->nama_pegawai }}</td>
              <td style="border: 1px solid black">{{ $d->pegawai->jabatan->nama_jabatan }}</td>
              <td style="border: 1px solid black">{{ $d->status === 0 ? 'Pekerja Kontrak' : 'Pekerja Tetap' }}</td>
              <td style="border: 1px solid black">{{ number_format($d->gaji_pokok,0,',','.') }}</td>
              <td style="border: 1px solid black">{{ number_format($d->tunjangan,0,',','.') }}</td>
              <td style="border: 1px solid black">{{ $d->total_hadir }}</td>
              <td style="border: 1px solid black">{{ number_format($d->gaji_harian,0,',','.') }}</td>
              <td style="border: 1px solid black">{{ number_format($d->tunjangan_harian,0,',','.') }}</td>
              <td style="border: 1px solid black">{{ number_format($d->bonus,0,',','.') }}</td>
              <td style="border: 1px solid black">{{ number_format($d->potongan,0,',','.') }}</td>
              <td style="border: 1px solid black">{{ number_format($d->total_gaji,0,',','.') }}</td>
          </tr>
          @php
              $no++;
          @endphp
      @endforeach
  </tbody>
</table>

<table>
  <tbody>
    <tr>
      <td></td>
      <td colspan="14"></td>
    </tr>
    <tr>
      <td></td>
      <td colspan="11"></td>
      <td colspan="3" style="text-align: center">Gianyar, {{ date('d-m-Y') }}</td>
    </tr>
    <tr>
      <td></td>
      <td colspan="11"></td>
      <td colspan="3"></td>
    </tr>
    <tr>
      <td></td>
      <td colspan="11"></td>
      <td colspan="3" style="text-align: center">Pembuku</td>
    </tr>
    <tr>
      <td></td>
      <td colspan="11"></td>
      <td colspan="3"></td>
    </tr>
    <tr>
      <td></td>
      <td colspan="11"></td>
      <td colspan="3"></td>
    </tr>
    <tr>
      <td></td>
      <td colspan="11"></td>
      <td colspan="3"></td>
    </tr>
    <tr>
      <td></td>
      <td colspan="11"></td>
      <td colspan="3" style="text-align: center; font-weight: bold">______________________</td>
    </tr>
  </tbody>
</table>
