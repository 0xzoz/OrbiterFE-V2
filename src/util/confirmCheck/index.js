import BigNumber from 'bignumber.js'
import util from '../../util/util'
import transferCalculate from '../../util/transfer/transferCalculate'
import axios from 'axios'
import { netStateUrl } from '../../../env'
import { realSelectMakerInfo } from '../../composition/hooks'

async function checkStateWhenConfirmTransfer(transferBalance) {
  const selectMakerInfo = realSelectMakerInfo.value
  try {
    const _balance = await getBalance(
      selectMakerInfo.makerAddress,
      selectMakerInfo.c2ID,
      selectMakerInfo.t2Address,
      selectMakerInfo.tName,
      selectMakerInfo.precision
    )
    if (_balance > 0) {
      let makerMaxBalance = new BigNumber(_balance * 0.95)
      if (makerMaxBalance.lt(transferBalance)) {
        util.showMessage(
          'The liquidity is not enough, please try it later.',
          'error'
        )
        return false
      }
      return true
    }
    return true
  } catch (err) {
    return true
  }
}

async function getBalance(
  makerAddress,
  chainId,
  tokenAddress,
  tokenName,
  precision
) {
  try {
    if (!makerAddress) {
      return 0
    }
    const response = await transferCalculate.getTransferBalance(
      chainId,
      tokenAddress,
      tokenName,
      makerAddress,
      true
    )
    return (response / 10 ** precision).toFixed(6)
  } catch (error) {
    return 0
  }
}

async function netStateBlock(fromChainID) {
  let response
  try {
    response = await axios.get(`${netStateUrl}/chains`)
    if (response.status == 200) {
      let netDic = response.data
      let netArr = Object.values(netDic)
      if (netArr && netArr.length) {
        let netState = netArr.find((item) => {
          return item.chainID == fromChainID
        })
        if (netState != undefined) {
          return !netState.net_state
        }
      }
    }
    return true
  } catch (error) {
    return true
  }
}

export { checkStateWhenConfirmTransfer, netStateBlock }
