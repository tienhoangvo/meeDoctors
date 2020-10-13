import { config } from 'dotenv'
import path from 'path'
export default config({
  path: path.join(process.cwd(), './config.env'),
})
