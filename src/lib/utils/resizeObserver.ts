let observer: ResizeObserver;
let callbacks: WeakMap<any, (element: any) => any>;

export function resizeObserver<E extends Element>(element: E, onResize: (element: E) => any) {
	if (!observer) {
		callbacks = new WeakMap();
		observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const onResize = callbacks.get(entry.target);
				if (onResize) onResize(entry.target);
			}
		});
	}

	callbacks.set(element, onResize);
	observer.observe(element);

	return {
		destroy: () => {
			callbacks.delete(element);
			observer.unobserve(element);
		}
	};
}
