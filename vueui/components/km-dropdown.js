/**
 * 轻量下拉（替代 uib-dropdown）：容器加 .open 类由 Bootstrap 3 样式接管，
 * 点击外部自动收起。用法：
 *   <div class="dropdown" v-km-dropdown> ... toggle 元素加 data-toggle ... </div>
 */
export const kmDropdown = {
    mounted(el) {
        el.__kmToggle = (e) => {
            // 点击 toggle 或其内部元素时切换
            if (e.target.closest('[data-toggle="dropdown"], .dropdown-toggle')) {
                e.preventDefault();
                const parent = e.target.closest('.dropdown, .btn-group-vertical');
                if (parent) parent.classList.toggle('open');
            } else if (!e.target.closest('.dropdown-menu')) {
                // 点击其他区域：收起所有下拉
                document.querySelectorAll('.dropdown.open, .btn-group-vertical.open')
                    .forEach(d => d.classList.remove('open'));
            }
        };
        document.addEventListener('click', el.__kmToggle);
    },
    unmounted(el) {
        document.removeEventListener('click', el.__kmToggle);
    }
};

export function closeAllDropdowns() {
    document.querySelectorAll('.dropdown.open, .btn-group-vertical.open')
        .forEach(d => d.classList.remove('open'));
}
