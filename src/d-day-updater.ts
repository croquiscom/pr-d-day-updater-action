import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import {isHoliday} from 'korean-business-day'
import {getOctokit} from '@actions/github'
import {Endpoints} from '@octokit/types'
dayjs.extend(utc)
dayjs.extend(timezone)

type PullRequestsResponseType =
  Endpoints['GET /repos/{owner}/{repo}/pulls']['response']
type LabelsType =
  Endpoints['GET /repos/{owner}/{repo}/pulls']['response']['data'][0]['labels']

const PREFIX_D_DAY_LABEL = 'D-'

function getCurDDayLabel(labels: LabelsType): string | null {
  const targetLabel = labels.find(label =>
    label.name.includes(PREFIX_D_DAY_LABEL)
  )
  if (!targetLabel) {
    return null
  }
  const day = Number(targetLabel.name.split(PREFIX_D_DAY_LABEL)[1])
  return `${PREFIX_D_DAY_LABEL}${day}`
}

function getNextDDayLabel(labels: LabelsType): string | null {
  const targetLabel = labels.find(label =>
    label.name.includes(PREFIX_D_DAY_LABEL)
  )
  if (!targetLabel) {
    return null
  }
  const day = Number(targetLabel.name.split(PREFIX_D_DAY_LABEL)[1])
  if (day === 0) {
    return 'D-0'
  }
  return `${PREFIX_D_DAY_LABEL}${day - 1}`
}

export async function dDayUpdate(
  github_token: string,
  github_repository: string
): Promise<void> {
  if (isHoliday(new Date())) {
    console.log('Not Korean Business Day')
    return
  }
  dayjs.tz.setDefault('Asia/Seoul')
  const octokit = getOctokit(github_token)
  const [owner, repo] = github_repository.split('/')

  const {data: pullRequests}: PullRequestsResponseType =
    await octokit.rest.pulls.list({
      owner,
      repo
    })
  console.log(`There are ${pullRequests.length} open pull requests`)

  if (pullRequests.length > 0) {
    console.log('********** start update D-Day Labels **********')
    let updateRequestCount = 0
    let updatedCount = 0
    const now = dayjs().tz()
    for (const pr of pullRequests) {
      const prCreateAt = dayjs(pr.created_at).tz()
      if (now.get('D') === prCreateAt.get('D')) {
        continue
      }

      const otherLabels = pr.labels
        .filter(label => label.name.includes('D-'))
        .map(label => label.name)

      const curDdayLabel = getCurDDayLabel(pr.labels)
      const nextDdayLabel = getNextDDayLabel(pr.labels)
      if (!nextDdayLabel) {
        continue
      }

      console.log(
        `update [${pr.number}]${pr.title} : ${curDdayLabel} => ${nextDdayLabel}`
      )

      try {
        updateRequestCount++
        const res = await octokit.rest.issues.update({
          owner,
          repo,
          issue_number: pr.number,
          labels: [nextDdayLabel, ...otherLabels]
        })

        if (res.status !== 200) {
          throw new Error('fail')
        }
        updatedCount++
      } catch (e) {
        console.log('update fail, pullrequest:', pr.url)
      }
    }
    console.log(
      `********** update completed D-Day Labels  ${updatedCount}/${updateRequestCount} **********`
    )
  }
}
