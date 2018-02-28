var request = require('superagent')
var bluebird = require('bluebird')
const token = 'wowT9T75SnlXwL4Kk-78GpX08IGpZYOb1RR'

async function main () {
  let count = 0
  let body = {
    cmd: 'alive',
    token: token,
    monsterId: Date.now() - 186058,
    jump: 0,
    lose: 0,
    die: 5,     // 杀敌数
    tenGoldDie: 0,
    treasureDie: 0,
    addGold: 5.29159367595671e50,
    click: 40,  // 点击次数，太大会报错
    critClick: 5,
    handClick: 0,
    clickAnger: 0,
    now: Date.now()
  }

  let upgradeBody = {
    cmd: 'heroUp',
    token: token,
    heroId: 19,
    type: 3,
    now: Date.now()
  }
  while (true) {
    await bluebird.delay(2000)
    await send()
    count++
    // 升级装备
    if (count % (2) === 0) await upgrade()
    // 点击宝箱
    if (count % (30) === 0) await getFlyTreasurePrize()
  }

  async function send () {
    try {
      console.log('body.die', body.die)
      const res = await request
        .post('http://115.159.56.31:3115/game?')
        .set('Accept', '*/*')
        .set('Pragma', 'no-cache')
        .set('Referer', 'http://cdn.11h5.com/wow/vutimes/?token=85af266342e8d0d9447fc6fef1cfc80f&_t=1519634764443&fuid=328302575&chid=914&share_from=msg&belong=wx1&wallow=1')
        .set('User-Agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1')
        .send(body)
        .timeout(2500)
      const result = JSON.parse(res.text)
      if (result) {
        const isSuccess = result.progress >= 0
        console.log('result', isSuccess ? {
          area: result.area,
          jump: result.jump,
          gold: result.gold,
          progress: result.progress
        } : result);

        if (isSuccess) {
          body.jump = 0
          // 基础杀敌
          body.die += 1

          // boss关只能杀一个
          if (result.area % 5 === 0) {
            body.die = 1
          }
          // 跳关
          if (result.progress >= 250) {
            body.jump = 1
            // 打不过就使用技能
            await useSkill(1)
            await useSkill(2)
            await useSkill(3)
            await useSkill(4)
            await useSkill(5)
            await useSkill(6)
          }
        } else {
          body.die -= 1
          body.die = Math.max(0, body.die)
        }
      }
    } catch (err) {
      console.error('errs', err);
    }
  }

  async function upgrade () {
    try {
      console.log('body.heroId', upgradeBody.heroId, upgradeBody.type)
      const res = await request
        .get('http://115.159.56.31:3116/game')
        .set('Accept', '*/*')
        .set('Pragma', 'no-cache')
        .set('Referer', 'http://cdn.11h5.com/wow/vutimes/?token=85af266342e8d0d9447fc6fef1cfc80f&_t=1519634764443&fuid=328302575&chid=914&share_from=msg&belong=wx1&wallow=1')
        .set('User-Agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1')
        .query(upgradeBody)
        .timeout(2500)
      const result = JSON.parse(res.text)

      if (result) {
        const isSuccess = result.heroId >= 0
        console.log('upgrade result', isSuccess ? {
          heroId: result.heroId,
          upto: result.heroList[result.heroId].lv
        } : result);
        upgradeBody.heroId -= 1
        if (upgradeBody.heroId <= 15) upgradeBody.heroId = 25
        if (!isSuccess) {
          upgradeBody.type = 0
        } else {
          upgradeBody.type = 1
        }
      }
    } catch (err) {
      console.error('errs', err);
    }
  }

  async function getFlyTreasurePrize () {
    try {
      // http://115.159.56.31:3116/game?cmd=getFlyTreasurePrize&token=wowr79T9f9r4EINaqhYFb9bxL3z4D6qEOsA&now=1519640983262
      const res = await request
        .get('http://115.159.56.31:3116/game')
        .set('Accept', '*/*')
        .set('Pragma', 'no-cache')
        .set('Referer', 'http://cdn.11h5.com/wow/vutimes/?token=85af266342e8d0d9447fc6fef1cfc80f&_t=1519634764443&fuid=328302575&chid=914&share_from=msg&belong=wx1&wallow=1')
        .set('User-Agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1')
        .query({
          cmd: 'getFlyTreasurePrize',
          token: token,
          now: Date.now()
        })
        .timeout(2500)
      const result = JSON.parse(res.text)
      console.log('getFlyTreasurePrize result', result)
    } catch (err) {
      console.error('errs', err);
    }
  }

  async function useSkill (skillId) {
    try {
      // http://115.159.56.31:3116/game?cmd=useSkill&token=wowfxUEOgIRWlcD3yEACsOsNX5cAICgZdYH&skillId=1&type=0&now=1519698331905
      const res = await request
        .get('http://115.159.56.31:3116/game')
        .set('Accept', '*/*')
        .set('Pragma', 'no-cache')
        .set('Referer', 'http://cdn.11h5.com/wow/vutimes/?token=85af266342e8d0d9447fc6fef1cfc80f&_t=1519634764443&fuid=328302575&chid=914&share_from=msg&belong=wx1&wallow=1')
        .set('User-Agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1')
        .query({
          cmd: 'useSkill',
          token: token,
          skillId: skillId,
          type: 0,
          now: Date.now()
        })
        .timeout(2500)
      const result = JSON.parse(res.text)
      console.log('useSkill result', result)
    } catch (err) {
      console.error('errs', err);
    }
  }
}

main().then(result => {
  console.log('run result', result)
}).catch(err => {
  console.error('run err', err)
})

