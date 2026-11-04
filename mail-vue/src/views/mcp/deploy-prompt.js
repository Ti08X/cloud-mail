// Deploy prompt for the Cloud Mail MCP service.
//
// This is the single source of the prompt text shown on the MCP landing page
// (mail-vue/src/views/mcp/index.vue). The public reference copy at
// mail-vue/public/mcp-deploy-prompt.txt must stay identical to the string
// below; update both in the same commit.
//
// The prompt deliberately contains NO real key: the agent must ask the user
// for the bearer key before configuring anything. It also states the expected
// tool inventory (4 read + 10 write) so an agent cannot report success while
// write access is still off.

export const MCP_DEPLOY_PROMPT = `请为我安装 Cloud Mail 的 MCP 服务，让你能用我的邮箱收发和管理邮件。

1. 添加一个名为 cloudmail 的 MCP 服务器，使用 Streamable HTTP 方式，端点是 https://mail.zgatri.com/mcp/，请求时要在 Authorization 请求头里带 Bearer 密钥。
2. 在配置之前，必须先问我要密钥；我把密钥发给你之后，你再继续配置。没有密钥不要猜、不要跳过、不要用占位符假装完成。密钥只写进你正在配置的 MCP 客户端配置里（文件权限 600），不要回显、不要发到别处，也不要写进公开文件。
3. Claude Code 的配置方式参考：
   claude mcp add --transport http cloudmail https://mail.zgatri.com/mcp/ --header "Authorization: Bearer <把这里换成我给你的密钥>"
   其他客户端用通用 JSON 配置参考：
   {
     "mcpServers": {
       "cloudmail": {
         "url": "https://mail.zgatri.com/mcp/",
         "headers": {
           "Authorization": "Bearer <把这里换成我给你的密钥>"
         }
       }
     }
   }
   没有 claude 命令就改该客户端自己的 MCP 配置文件。如果客户端不会热加载配置，先告诉我要重启，重启之后再继续验证。
4. 配置完成后，自己跑一次 tools/list 验证，不要只看配置写成功就报喜：
   - 只读工具应有 4 个：accounts_list、mail_list、mail_search、mail_get。
   - 写工具应有 10 个：mail_send、mail_reply、mail_forward、mail_delete、mail_mark_read、account_add、account_delete、account_set_name、account_set_all_receive、account_set_top。
   - 合计应为 14 个。只有 4 个只读工具时，说明服务端写功能未开启，请如实告诉我「写功能未开启」，不要声称能发信、删信或增删邮箱地址。
   - 自检写通道时不要真发邮件：用 mail_mark_read 传一个不存在的 emailId（例如 [999999]），返回 markedRead 即说明写通道可用；确实需要发一封测试邮件时先问我。
5. 最后报告：连接状态、工具总数、按读/写分组的工具清单、写通道自检结果。并说明这把密钥以管理员身份运作，覆盖该实例下所有邮箱账号。`;
