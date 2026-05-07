Drive Manager
Drive Manager offers an API to configure and use multiple Disk instances from a single object. Using Drive Manager is not a hard requirement. However, it does make switching between disks more straightforward and offers a fake API for writing tests.

You may create an instance of Drive Manager by providing it a collection of services you want to use throughout your application.

Copy code to clipboard
import { DriveManager } from 'flydrive'
import { FSDriver } from 'flydrive/drivers/fs'
import { GCSDriver } from 'flydrive/drivers/gcs'

export const drive = new DriveManager({
/\*\*

- Name of the default service. It must be defined inside
- the service object
  \*/
  default: 'fs',

/\*\*

- A collection of services you plan to use in your application
  \*/
  services: {
  fs: () =>
  new FSDriver({
  location: new URL('./uploads', import.meta.url),
  visibility: 'public',
  }),
  gcs: () =>
  new GCSDriver({
  region: 'sgp1',
  endpoint: 'https://sgp1.digitaloceanspaces.com',
  credentials: {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  visibility: 'public',
  }),
  },
  })
  default

The default property refers to the service name you want to resolve from the Drive manager without defining any explicit name.

services

The services property refers to the collection of services you plan to use within your application. For example, If you want to use the fs service during development and gcs in production, you must register both within the services object.

Creating a Disk instance
You may create an instance of Disk for a given service using the drive.use method. This method accepts the service name and returns a singleton instance of the Disk class.

Copy code to clipboard
/\*\*

- Returns an instance of the disk with the
- "default" service.
  \*/
  const disk = drive.use()

/\*\*

- Returns an instance of the disk with the
- "fs" service.
  \*/
  const disk = drive.use('fs')

/\*\*

- Returns an instance of the disk with the
- "gcs" service.
  \*/
  const disk = drive.use('gcs')
  Using fakes
  The fake API of Drive Manager could be used when writing tests. In the fake mode, the drive.use method will return an instance of Disk with fs driver. Therefore, all files are written to the local filesystem even when using a remote storage provider.

In order to use fakes, you must configure a filesystem location where the files should be written during tests. Drive manager will ensure to cleanup these files when you restore fakes.

Copy code to clipboard
export const drive = new DriveManager({
default: 'fs',

fakes: {
location: new URL('./tmp/fakes', import.meta.url),
urlBuilder: {
generateURL(key, filePath) {
return `url-to-file`
},
generateSignedURL(key, filePath, options) {
return `signed-url-to-file`
},
},
},

services: {
fs: () =>
new FSDriver({
// config goes here
}),
gcs: () =>
new GCSDriver({
// config goes here
}),
},
})
When writing tests, we use the drive.fake method to create a fake implementation of the GCS service. Once the test is completed, you must restore the original implementation using the drive.restore method. The restore method will also delete all files created during the tests.

tests/user.spec.ts
Copy code to clipboard
import { test } from '@japa/runner'
import { drive } from '../services/drive.js'

test('save user uploaded file', async () => {
/\*\*

- Creating a fake at the start of the test.
  \*/
  const fakes = drive.fake('gcs')

/\*\*

- Execute the code to be tested. For now, we will use
- drive APIs directly.
  \*/
  const key = 'hello.txt'
  const contents = 'Hello world'
  await drive.use('gcs').put(key, contents)

/\*\*

- Use assertions to ensure the write operation was triggered.
- Remember, no files have been created with GCS in fake mode
  \*/
  fakes.assertExists(key)

/\*\*

- Restore the original implementation and delete
- files created during tests
  \*/
  drive.restore('gcs')
  })
  The drive.fake method returns a fakes object that can be used to write assertions. Following is the list of available assertion methods.

Copy code to clipboard
const fakes = drive.fake('gcs')

/\*\*

- Assert a file exists
  \*/
  fakes.assertExists(key)

/\*\*

- Assert a file does not exist
  \*/
  fakes.assertMissing(key)
