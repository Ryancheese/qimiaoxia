import { useMemo, useState } from 'react'

const CMDS = [
  { cmd: 'ls -lah', desc: '详细列出当前目录文件' },
  { cmd: 'cd /path', desc: '切换目录' },
  { cmd: 'pwd', desc: '显示当前路径' },
  { cmd: 'mkdir -p a/b', desc: '递归创建目录' },
  { cmd: 'rm -rf dir', desc: '强制删除目录（慎用）' },
  { cmd: 'cp -r src dst', desc: '递归复制' },
  { cmd: 'mv a b', desc: '移动或重命名' },
  { cmd: 'cat file', desc: '查看文件内容' },
  { cmd: 'less file', desc: '分页查看文件' },
  { cmd: 'head -n 20 file', desc: '查看前 20 行' },
  { cmd: 'tail -f log', desc: '实时跟踪日志' },
  { cmd: 'grep -rn "kw" .', desc: '递归搜索关键字' },
  { cmd: 'find . -name "*.ts"', desc: '按文件名查找' },
  { cmd: 'chmod +x script.sh', desc: '添加可执行权限' },
  { cmd: 'chown user:group f', desc: '修改所有者' },
  { cmd: 'ps aux | grep node', desc: '查找进程' },
  { cmd: 'kill -9 PID', desc: '强制结束进程' },
  { cmd: 'df -h', desc: '查看磁盘空间' },
  { cmd: 'du -sh *', desc: '统计目录大小' },
  { cmd: 'free -h', desc: '查看内存' },
  { cmd: 'top', desc: '实时资源监控' },
  { cmd: 'curl -I url', desc: '查看 HTTP 头' },
  { cmd: 'wget url', desc: '下载文件' },
  { cmd: 'tar -czvf a.tgz dir', desc: '压缩目录为 tar.gz' },
  { cmd: 'tar -xzvf a.tgz', desc: '解压 tar.gz' },
  { cmd: 'ssh user@host', desc: '远程登录' },
  { cmd: 'scp file user@host:', desc: '远程拷贝文件' },
  { cmd: 'apt update && apt upgrade', desc: 'Debian/Ubuntu 更新' },
  { cmd: 'systemctl status nginx', desc: '查看服务状态' },
  { cmd: 'journalctl -u nginx -f', desc: '查看服务日志' },
]

export function LinuxCmd() {
  const [q, setQ] = useState('')
  const list = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return CMDS
    return CMDS.filter((c) => `${c.cmd} ${c.desc}`.toLowerCase().includes(s))
  }, [q])

  return (
    <div className="tool-stack">
      <input
        className="tool-input"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="搜索命令或说明…"
      />
      <ul className="cmd-list">
        {list.map((c) => (
          <li key={c.cmd}>
            <code>{c.cmd}</code>
            <span>{c.desc}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
