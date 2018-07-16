Vue.component("site-nav", {
	template: `
		<header>
			<nav id="nav" class="grey darken-3">
				<div class="nav-wrapper">
					<a href="./" class="brand-logo">ToMetric</a>
					<ul class="right">
						<li><a class="" href="options.html"><i class="material-icons left">settings</i>Options</a></li>
					</ul>
				</div>
			</nav>
		</header>`
});

new Vue({
	el: '#navBar'
});