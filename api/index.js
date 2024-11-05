const express = require('express')
const http = require('http')
const cors = require('cors')
const { transaction } = require('./lib/routes')
const logger = require('./logger')

const config = require('./config')

if (config.SENTRY_DSN) {
  const Sentry = require('@sentry/node')
  Sentry.init({
    dsn: config.SENTRY_DSN,
    release: require('./package.json').version
  })
}

const { ethers } = require('ethers')
const provider = new ethers.providers.JsonRpcProvider(
  'https://mainnet.infura.io/v3/e14f5d01e4d94deb9d97ea366078a78c'
)

const cryptoKittiesAddress = '0x06012c8cf97BEaD5deAe237070F9587f8E7A266d'
const cryptoKittiesABI = [
  {
    constant: true,
    inputs: [{ name: '_interfaceID', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'cfoAddress',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { name: '_tokenId', type: 'uint256' },
      { name: '_preferredTransport', type: 'string' }
    ],
    name: 'tokenMetadata',
    outputs: [{ name: 'infoUrl', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'promoCreatedCount',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_tokenId', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'ceoAddress',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'GEN0_STARTING_PRICE',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: '_address', type: 'address' }],
    name: 'setSiringAuctionAddress',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'pregnantKitties',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '_kittyId', type: 'uint256' }],
    name: 'isPregnant',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'GEN0_AUCTION_DURATION',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'siringAuction',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_from', type: 'address' },
      { name: '_to', type: 'address' },
      { name: '_tokenId', type: 'uint256' }
    ],
    name: 'transferFrom',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: '_address', type: 'address' }],
    name: 'setGeneScienceAddress',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: '_newCEO', type: 'address' }],
    name: 'setCEO',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: '_newCOO', type: 'address' }],
    name: 'setCOO',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_kittyId', type: 'uint256' },
      { name: '_startingPrice', type: 'uint256' },
      { name: '_endingPrice', type: 'uint256' },
      { name: '_duration', type: 'uint256' }
    ],
    name: 'createSaleAuction',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'unpause',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '', type: 'uint256' }],
    name: 'sireAllowedToAddress',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { name: '_matronId', type: 'uint256' },
      { name: '_sireId', type: 'uint256' }
    ],
    name: 'canBreedWith',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '', type: 'uint256' }],
    name: 'kittyIndexToApproved',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_kittyId', type: 'uint256' },
      { name: '_startingPrice', type: 'uint256' },
      { name: '_endingPrice', type: 'uint256' },
      { name: '_duration', type: 'uint256' }
    ],
    name: 'createSiringAuction',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: 'val', type: 'uint256' }],
    name: 'setAutoBirthFee',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_addr', type: 'address' },
      { name: '_sireId', type: 'uint256' }
    ],
    name: 'approveSiring',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: '_newCFO', type: 'address' }],
    name: 'setCFO',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_genes', type: 'uint256' },
      { name: '_owner', type: 'address' }
    ],
    name: 'createPromoKitty',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: 'secs', type: 'uint256' }],
    name: 'setSecondsPerBlock',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'paused',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'withdrawBalance',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '_tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: 'owner', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'GEN0_CREATION_LIMIT',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'newContractAddress',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: '_address', type: 'address' }],
    name: 'setSaleAuctionAddress',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'count', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: '_v2Address', type: 'address' }],
    name: 'setNewAddress',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'secondsPerBlock',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'pause',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'tokensOfOwner',
    outputs: [{ name: 'ownerTokens', type: 'uint256[]' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: '_matronId', type: 'uint256' }],
    name: 'giveBirth',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'withdrawAuctionBalances',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '', type: 'uint256' }],
    name: 'cooldowns',
    outputs: [{ name: '', type: 'uint32' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '', type: 'uint256' }],
    name: 'kittyIndexToOwner',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_tokenId', type: 'uint256' }
    ],
    name: 'transfer',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'cooAddress',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'autoBirthFee',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'erc721Metadata',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: '_genes', type: 'uint256' }],
    name: 'createGen0Auction',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '_kittyId', type: 'uint256' }],
    name: 'isReadyToBreed',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'PROMO_CREATION_LIMIT',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: '_contractAddress', type: 'address' }],
    name: 'setMetadataAddress',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'saleAuction',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '_id', type: 'uint256' }],
    name: 'getKitty',
    outputs: [
      { name: 'isGestating', type: 'bool' },
      { name: 'isReady', type: 'bool' },
      { name: 'cooldownIndex', type: 'uint256' },
      { name: 'nextActionAt', type: 'uint256' },
      { name: 'siringWithId', type: 'uint256' },
      { name: 'birthTime', type: 'uint256' },
      { name: 'matronId', type: 'uint256' },
      { name: 'sireId', type: 'uint256' },
      { name: 'generation', type: 'uint256' },
      { name: 'genes', type: 'uint256' }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_sireId', type: 'uint256' },
      { name: '_matronId', type: 'uint256' }
    ],
    name: 'bidOnSiringAuction',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'gen0CreatedCount',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'geneScience',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_matronId', type: 'uint256' },
      { name: '_sireId', type: 'uint256' }
    ],
    name: 'breedWithAuto',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  { payable: true, stateMutability: 'payable', type: 'fallback' },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: 'owner', type: 'address' },
      { indexed: false, name: 'matronId', type: 'uint256' },
      { indexed: false, name: 'sireId', type: 'uint256' },
      { indexed: false, name: 'cooldownEndBlock', type: 'uint256' }
    ],
    name: 'Pregnant',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: 'from', type: 'address' },
      { indexed: false, name: 'to', type: 'address' },
      { indexed: false, name: 'tokenId', type: 'uint256' }
    ],
    name: 'Transfer',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: 'owner', type: 'address' },
      { indexed: false, name: 'approved', type: 'address' },
      { indexed: false, name: 'tokenId', type: 'uint256' }
    ],
    name: 'Approval',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: 'owner', type: 'address' },
      { indexed: false, name: 'kittyId', type: 'uint256' },
      { indexed: false, name: 'matronId', type: 'uint256' },
      { indexed: false, name: 'sireId', type: 'uint256' },
      { indexed: false, name: 'genes', type: 'uint256' }
    ],
    name: 'Birth',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: 'newContract', type: 'address' }],
    name: 'ContractUpgrade',
    type: 'event'
  }
]

const cryptoKittiesContract = new ethers.Contract(
  cryptoKittiesAddress,
  cryptoKittiesABI,
  provider
)

async function main() {
  const app = express()
  const httpServer = http.createServer(app)

  app.use(express.json())
  app.use(config.transactionPath, cors(), transaction)
  app.get('/vijaysugaliapitest/:id', async (req, res) => {
    const kittyId = parseInt(req.params.id, 10)
    logger.info(`Received Kitty ID: ${kittyId}`)

    if (isNaN(kittyId)) {
      logger.warn('Kitty ID is not a valid number')
      return res
        .status(400)
        .json({ error: 'Invalid NFT ID (kitty ID) provided' })
    }

    try {
      logger.debug('Fetching kitty data...')
      const kittyData = await cryptoKittiesContract.getKitty(kittyId)
      const owner = await cryptoKittiesContract.ownerOf(kittyId)
      logger.debug(`Fetched Kitty Data: ${JSON.stringify(kittyData)}`)

      // Assuming the array structure as per the logs
      const kittyDetails = {
        isGestating: kittyData[0],
        isReady: kittyData[1],
        cooldownIndex: kittyData[2].toString(),
        nextActionAt: kittyData[3].toString(),
        siringWithId: kittyData[4].toString(),
        birthTime: new Date(kittyData[5].toNumber() * 1000).toLocaleString(),
        matronId: kittyData[6].toString(),
        sireId: kittyData[7].toString(),
        generation: kittyData[8].toString(),
        genes: kittyData[9].toString(),
        owner
      }

      logger.info(
        'Returning Kitty Information:',
        kittyDetails
      )
      res.status(200).json(kittyDetails)
    } catch (error) {
      logger.error(`Error fetching kitty data: ${error.message}`)
      res
        .status(500)
        .json({ error: 'Failed to fetch kitty data', details: error.message })
    }
  })

  // const apolloServer = await createApolloServer(httpServer)
  // app.use(
  //   apolloServer.getMiddleware({ app, path: config.queryPath, cors: true })
  // )

  httpServer.listen({ port: config.port }, () => {
    // console.log(`GraphQL Queries ready at ${apolloServer.graphqlPath}`)
    // console.log(
    //   `GraphQL Subscriptions ready at ${apolloServer.subscriptionsPath}`
    // )
    console.log(`Transaction service ready at ${config.transactionPath}`)
  })
}

main()
