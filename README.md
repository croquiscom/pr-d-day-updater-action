# PR D-Day Updater Action

PR Label의 D-Day 업데이트 해주는 액션

`D-X` 형태의 Label을 1일 줄여서 업데이트.

PR 생성 일자와 비교하여 다르면 업데이트

ex) `D-5` 업데이트 실행 후 `D-4`

한국 근무일에만 동작

## Example usage

```yaml
- name: pr d-day updater
  uses: croquiscom/pr-d-day-updater-action@v1
```
