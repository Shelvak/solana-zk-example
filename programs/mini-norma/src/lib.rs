use anchor_lang::prelude::*;

declare_id!("FGhjv6bzJNAeXV1Q25Xq22Fi9G1s1fuPbxAZUZe4THXx");

#[program]
pub mod mini_norma {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
