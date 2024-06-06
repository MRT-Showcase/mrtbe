#!/usr/bin/env node

import { spawn } from 'node:child_process'

const env = { ...process.env }

if (process.env.DATABASE_URL) {
  try {
    const databaseUrl = new URL(process.env.DATABASE_URL)
    env.DB_HOST = databaseUrl.hostname
    env.DB_PORT = databaseUrl.port
    env.DB_USER = databaseUrl.username
    env.DB_PASSWORD = databaseUrl.password
    env.DB_NAME = databaseUrl.pathname.slice(1).split('?')[0]
    env.DB_SSL = 'true'
  } catch (err) {
    console.error('Invalid DATABASE_URL')
  }
}

;(async () => {
  // launch application
  await exec(process.argv.slice(2).join(' '))
})()

function exec(command) {
  const child = spawn(command, { shell: true, stdio: 'inherit', env })
  return new Promise((resolve, reject) => {
    child.on('exit', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`${command} failed rc=${code}`))
      }
    })
  })
}
