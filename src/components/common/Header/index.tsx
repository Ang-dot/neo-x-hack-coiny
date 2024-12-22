import useIsSafeOwner from '@/hooks/useIsSafeOwner'
import { useIsWalletProposer } from '@/hooks/useProposers'
import type { Dispatch, SetStateAction } from 'react'
import { type ReactElement } from 'react'
import { useRouter } from 'next/router'
import type { Url } from 'next/dist/shared/lib/router/router'
import { Paper } from '@mui/material'
import classnames from 'classnames'
import css from './styles.module.css'
import ConnectWallet from '@/components/common/ConnectWallet'
import NetworkSelector from '@/components/common/NetworkSelector'
import { AppRoutes } from '@/config/routes'
import Link from 'next/link'
import useSafeAddress from '@/hooks/useSafeAddress'
import { FEATURES } from '@/utils/chains'
import { useHasFeature } from '@/hooks/useChains'
import { useSafeTokenEnabled } from '@/hooks/useSafeTokenEnabled'
import { useVisibleBalances } from '@/hooks/useVisibleBalances'
import FiatValue from '@/components/common/FiatValue'
import TokenAmount from '@/components/common/TokenAmount'
import useSafeInfo from '@/hooks/useSafeInfo'

type HeaderProps = {
  onMenuToggle?: Dispatch<SetStateAction<boolean>>
  onBatchToggle?: Dispatch<SetStateAction<boolean>>
}

function getLogoLink(router: ReturnType<typeof useRouter>): Url {
  return router.pathname === AppRoutes.home || !router.query.safe
    ? router.pathname === AppRoutes.welcome.accounts
      ? AppRoutes.welcome.index
      : AppRoutes.welcome.accounts
    : { pathname: AppRoutes.home, query: { safe: router.query.safe } }
}

const Header = ({ onMenuToggle, onBatchToggle }: HeaderProps): ReactElement => {
  const safeAddress = useSafeAddress()
  const showSafeToken = useSafeTokenEnabled()
  const isProposer = useIsWalletProposer()
  const isSafeOwner = useIsSafeOwner()
  const router = useRouter()
  const { balances, loading: balancesLoading } = useVisibleBalances()
  const { safe, safeLoading, safeLoaded } = useSafeInfo()
  const enableWc = useHasFeature(FEATURES.NATIVE_WALLETCONNECT)

  // If on the home page, the logo should link to the Accounts or Welcome page, otherwise to the home page
  const logoHref = getLogoLink(router)

  const handleMenuToggle = () => {
    if (onMenuToggle) {
      onMenuToggle((isOpen) => !isOpen)
    } else {
      router.push(logoHref)
    }
  }

  const handleBatchToggle = () => {
    if (onBatchToggle) {
      onBatchToggle((isOpen) => !isOpen)
    }
  }

  const showBatchButton = safeAddress && (!isProposer || isSafeOwner)

  return (
    <Paper className="flex flex-row flex-nowrap items-center relative h-14 bg-[#FFF0BE] px-4 rounded-none border-b-2 border-black">
      <Link href="/home" className="md:ml-10 text-2xl font-nountown text-black flex grow">
        Coiny
      </Link>

      <Link href="/game" className="text-md font-londrina animate-pulse text-pink-500 flex grow hover:text-pink-700 transition-colors" target='_blank'>
        Game On? Loser covers the gas fee! 🎮
      </Link>

      <div className={classnames('flex flex-row items-center', { 'md:mr-10': !safeAddress })}>
        <ConnectWallet />

        {safeAddress && (
          // <div className={classnames(css.element, css.networkSelector)}>
          //   <NetworkSelector offerSafeCreation />
          // </div>
          <div className="flex items-center gap-3 ps-5">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black">
              <img
                src="/Gas.png"
                alt="Gas Icon"
                width={32}
                height={32}
                className="object-contain p-1.5"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold">Neo X Mainnet</span>
              {/* {safe.deployed ? (
                <FiatValue value={balances.fiatTotal} maxLength={20} precise />
              ) : (
                <TokenAmount
                  value={balances.items[0].balance}
                  decimals={balances.items[0].tokenInfo.decimals}
                  tokenSymbol={balances.items[0].tokenInfo.symbol}
                />
              )} */}
            </div>
          </div>
        )}
      </div>
    </Paper>
  )
}

export default Header
