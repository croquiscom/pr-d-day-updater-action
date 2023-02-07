# PR D-Day Updater Action

PR Label의 D-Day 업데이트 해주는 액션

`D-X` 값 을 `-1` 하여 업데이트

ex)

- `D-5` -> `D-4`,

- `D-0` -> `D-0` (변화없음)

### 주의사항

- PR 생성 일자와 액션 실행 일자가 다를 경우에만 동작

- 한국 근무일에만 동작

## Example usage

```yaml
- name: pr d-day updater
  uses: croquiscom/pr-d-day-updater-action@v1
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      GITHUB_REPOSITORY: ${{ secrets.GITHUB_REPOSITORY }}
```
