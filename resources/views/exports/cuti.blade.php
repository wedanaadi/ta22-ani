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
          <td colspan="7" style="text-align: center; font-size: 13px; font-weight: bold">LAPORAN DATA CUTI</td>
      </tr>
      <tr>
          <td></td>
          <td colspan="7" style="text-align: center"></td>
      </tr>
  </tbody>
</table>

<table>
  <thead>
      <tr>
          <th></th>
          <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">NO</th>
          <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">NIK</th>
          <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">NAMA PEGAWAI</th>
          <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">JABATAN</th>
          <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">TANGGAL MULAI</th>
          <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">TANGGAL SELESAI</th>
          <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">ALASAN</th>
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
              <td style="border: 1px solid black">{{ $d->pegawai->nik }}</td>
              <td style="border: 1px solid black">{{ $d->pegawai->nama_pegawai }}</td>
              <td style="border: 1px solid black">{{ $d->pegawai->jabatan->nama_jabatan }}</td>
              {{-- <td style="border: 1px solid black">{{ Carbon\Carbon::createFromTimestamp($timestamp)->toDateTimeString() }}</td> --}}
              <td style="border: 1px solid black">{{  date("Y-m-d", substr($d->tanggal_mulai, 0, 10))  }}</td>
              <td style="border: 1px solid black">{{  date("Y-m-d", substr($d->tanggal_selesai, 0, 10))  }}</td>
              <td style="border: 1px solid black">{{ $d->alasan }}</td>
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
      <td colspan="7"></td>
    </tr>
    <tr>
      <td></td>
      <td colspan="4"></td>
      <td colspan="3" style="text-align: center">Gianyar, {{ date('d-m-Y') }}</td>
    </tr>
    <tr>
      <td></td>
      <td colspan="4"></td>
      <td colspan="3"></td>
    </tr>
    <tr>
      <td></td>
      <td colspan="4"></td>
      <td colspan="3" style="text-align: center">Pembuku</td>
    </tr>
    <tr>
      <td></td>
      <td colspan="4"></td>
      <td colspan="3"></td>
    </tr>
    <tr>
      <td></td>
      <td colspan="4"></td>
      <td colspan="3"></td>
    </tr>
    <tr>
      <td></td>
      <td colspan="4"></td>
      <td colspan="3"></td>
    </tr>
    <tr>
      <td></td>
      <td colspan="4"></td>
      <td colspan="3" style="text-align: center; font-weight: bold">______________________</td>
    </tr>
  </tbody>
</table>
