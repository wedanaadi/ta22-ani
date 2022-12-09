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
            <td colspan="13" style="text-align: center; font-size: 13px; font-weight: bold">LAPORAN DATA PEGAWAI</td>
        </tr>
        <tr>
            <td></td>
            <td colspan="13" style="text-align: center"></td>
        </tr>
    </tbody>
</table>

<table>
    <thead>
        <tr>
            <th></th>
            <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">NO</th>
            <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">NIK</th>
            <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">NAMA
                PEGAWAI</th>
            <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">JABATAN
            </th>
            <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">TEMPAT
                LAHIR</th>
            <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">TANGGAL
                LAHIR</th>
            <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">JENIS
                KELAMIN</th>
            <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">ALAMAT
            </th>
            <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">AGAMA
            </th>
            <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">STATUS
                PERKAWINAN</th>
            <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">
                PENDIDIKAN</th>
            <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">TELEPON
            </th>
            <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">STATUS
                PEGAWAI</th>
            <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">TANGGAL
                BERGABUNG</th>
            <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">KONTRAK
                BERAKHIR</th>
            <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">MASA
                KERJA</th>
        </tr>
    </thead>
    <tbody>
        @php
            $no = 1;
            function masaKerja($bergabung)
            {
                $epochBergabung = strtotime($bergabung) * 1000;
                $epochNow = strtotime(date('Y-m-d')) * 1000;
                $second = ($epochNow - $epochBergabung) / 1000;
                $minute = $second / 60;
                $hour = $minute / 60;
                $day = $hour / 24;
                $month = $day / 30;
                $year = $month / 12;
                $format = '';
                if ($day >= 30) {
                    $day = $day - floor($month) * 30;
                }
                if ($month > 11) {
                    $month = $month - floor($year) * 12;
                }

                if ($year >= 1) {
                    $format .= floor($year) . ' Tahun ';
                }
                if ($month >= 1) {
                    $format .= floor($month) . ' Bulan ';
                }
                if ($day > 0) {
                    $format .= floor($day) . ' Hari';
                }
                return $format;
            }
        @endphp
        @foreach ($data as $d)
            <tr>
                <td></td>
                <td style="border: 1px solid black">{{ $no }}</td>
                <td style="border: 1px solid black">{{ "'" . $d->nik }}</td>
                <td style="border: 1px solid black">{{ $d->nama_pegawai }}</td>
                <td style="border: 1px solid black">{{ $d->jabatan->nama_jabatan }}</td>
                <td style="border: 1px solid black">{{ $d->tempat_lahir }}</td>
                <td style="border: 1px solid black">{{ $d->tanggal_lahir }}</td>
                <td style="border: 1px solid black">{{ $d->jenis_kelamin === 'L' ? 'Laki-Laki' : 'Perempuan' }}</td>
                <td style="border: 1px solid black">{{ $d->alamat }}</td>
                <td style="border: 1px solid black">{{ $d->agama }}</td>
                <td style="border: 1px solid black">
                    {{ $d->status_perkawinan === 0 ? 'Belum Menikah' : 'Sudah Menikah' }}</td>
                <td style="border: 1px solid black">{{ $d->pendidikan }}</td>
                <td style="border: 1px solid black">{{ $d->no_telepon }}</td>
                <td style="border: 1px solid black">{{ $d->status === 0 ? 'Pekerja Training' : 'Pekerja Kotrak' }}</td>
                <td style="border: 1px solid black">{{ $d->tanggal_bergabung }}</td>
                <td style="border: 1px solid black">{{ $d->kontrak_berakhir }}</td>
                <td style="border: 1px solid black">{{ masaKerja($d->tanggal_bergabung) }}</td>
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
            <td colspan="13"></td>
        </tr>
        <tr>
            <td></td>
            <td colspan="9"></td>
            <td colspan="3" style="text-align: center">Gianyar, {{ date('d-m-Y') }}</td>
        </tr>
        <tr>
            <td></td>
            <td colspan="9"></td>
            <td colspan="3"></td>
        </tr>
        <tr>
            <td></td>
            <td colspan="9"></td>
            <td colspan="3" style="text-align: center">Pembuku</td>
        </tr>
        <tr>
            <td></td>
            <td colspan="9"></td>
            <td colspan="3"></td>
        </tr>
        <tr>
            <td></td>
            <td colspan="9"></td>
            <td colspan="3"></td>
        </tr>
        <tr>
            <td></td>
            <td colspan="9"></td>
            <td colspan="3"></td>
        </tr>
        <tr>
            <td></td>
            <td colspan="9"></td>
            <td colspan="3" style="text-align: center; font-weight: bold">______________________</td>
        </tr>
    </tbody>
</table>
