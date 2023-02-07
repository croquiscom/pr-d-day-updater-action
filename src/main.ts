import * as core from '@actions/core'
import {dDayUpdate} from './d-day-updater'

async function run(): Promise<void> {
  try {
    const {GITHUB_TOKEN, GITHUB_REPOSITORY} = process.env
    if (!GITHUB_TOKEN) {
      throw new Error('GITHUB_TOKEN is required')
    }
    if (!GITHUB_REPOSITORY) {
      throw new Error('GITHUB_REPOSITORY is required')
    }

    await dDayUpdate(GITHUB_TOKEN, GITHUB_REPOSITORY)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
