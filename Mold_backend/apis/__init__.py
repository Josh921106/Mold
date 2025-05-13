import os
import importlib
from flask import Blueprint


def register_blueprints(app):
    package_dir = os.path.dirname(__file__)

    for filename in os.listdir(package_dir):
        if filename.endswith(".py") and filename != "__init__.py":
            module_name = f"apis.{filename[:-3]}"
            module = importlib.import_module(module_name)

            for attr in dir(module):
                obj = getattr(module, attr)
                if isinstance(obj, Blueprint):
                    app.register_blueprint(obj)
                    print(f"✅ Blueprint 註冊成功：{attr} ({module_name})")
