# Tasklist for Prototype 0.40.0

## P0: Critical Infrastructure & Security

- [ ] 1.1: src/services/crypto.js - Refactor scrypt usage
- [ ] 1.2: src/services/crypto.js - Implement timingSafeEqual() in verifyPassword
- [ ] 1.3: src/services/crypto.js - Fix typo "hec" to "hex" in encryptEmail
- [ ] 1.4: src/services/crypto.js - Fix authTagHex reference in decryptEmail
- [ ] 1.5: src/services/crypto.js - Fix hashKey reference error
- [ ] 3.1: Handshake Gatekeeping - Implement Ephemeral/Absolute security zones
- [ ] 3.2: Handshake Gatekeeping - Add grace period/F5 spam protection logic

## P1: Metrics & Monitoring

- [ ] 4.1: Database - Create game_metrics table
- [ ] 4.2: Backend - Wire visitor counter to game_metrics table
- [ ] 4.3: Frontend - Complete Retro odometer UI integration

## P2: Cleanup & Maintenance

- [ ] 5.1: Refactor references from `core/` to `src/`
