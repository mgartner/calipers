import * as fs from 'fs'

// HEADER_LENGTH is the number of bytes to initially read to determine the type
// of the given file. We read more than needed for this task, because for some
// image formats, like PNG, the dimension metadata lives close to the beginning
// of the file and we can avoid a second file read.
const HEADER_LENGTH = 24

// Format designates a supported file type for measurement.
export const enum Format {
  UNKNOWN = 0,
  PNG = 1 << 0
}

// Result is describes the result of measuring an image file.
export interface Result {
  readonly format: Format;
  readonly width: number;
  readonly height: number;
}

// measure returns the image dimensions of the file at the given path.
export async function measure (input: string | Buffer, formats: Format): Promise<Result> {
  if (Buffer.isBuffer(input)) {
    return measureBuffer(input)
  }

  let fd
  try {
    fd = await fs.promises.open(input, 'r')

    const b = Buffer.alloc(HEADER_LENGTH)
    await fd.read(b, 0, HEADER_LENGTH, 0)

    return measureBuffer(b)
  } finally {
    if (fd) {
      fd.close()
    }
  }
}

function measureBuffer (b: Buffer): Result {
  const format = detect(b)
  if (format === Format.PNG) {
    return measurePNG(b)
  }
  throw new Error('file type not supported')
}

// measurePNG returns the dimenions of a PNG file.
function measurePNG (header: Buffer): Result {
  const offset = 16
  return {
    format: Format.PNG,
    width: header.readUInt32BE(offset),
    height: header.readUInt32BE(4 + offset)
  }
}

// _PNG
const PNG_HEADER_1 = Buffer.from([0x89, 0x50, 0x4e, 0x47]).readUInt32BE(0)
// \r\n\x1a\n
const PNG_HEADER_2 = Buffer.from([0x0d, 0x0a, 0x1a, 0x0a]).readUInt32BE(0)
// IHDR
const PNG_HEADER_3 = Buffer.from([0x49, 0x48, 0x44, 0x52]).readUInt32BE(0)

// detect returns the file format of the given header buffer. Format.UNKNOWN is
// returned if the file type is not supported.
function detect (header: Buffer): Format {
  // PNG
  if (
    header.readUInt32BE(0) === PNG_HEADER_1 &&
    header.readUInt32BE(4) === PNG_HEADER_2 &&
    header.readUInt32BE(12) === PNG_HEADER_3
  ) {
    return Format.PNG
  }

  return Format.UNKNOWN
}
