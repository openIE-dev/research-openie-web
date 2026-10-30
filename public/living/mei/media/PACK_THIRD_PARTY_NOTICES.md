# Third-party notices

## SmellNet data (derived int8 test samples in `benchmarks/mcu_build_smellnet_32/` and `benchmarks/mcu_build_smellnet_64/` `testdata.h` files)

Source: Feng et al., SmellNet (ICLR 2026), the authors' GitHub release. Licensed under the MIT License:

```
MIT License

Copyright (c) 2026 Dewei Feng and contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Not included

- Chicken-spoilage e-nose data (Anwar & Anwar 2025, github.com/talhaanwarch/chicken_assessment_e-nose): no license, so it is not redistributed. `benchmarks/chicken_benchmark.py` reads a local copy (`CHICKEN_CSV`).
- CLINC150 (Larson et al. 2019, CC BY 3.0): not bundled; download `data_full.json` from github.com/clinc/oos-eval.
- Specifications and schemas used for validation (OpenADR 3.1 public mirror, Apache-2.0; NVIDIA DSX Flex AsyncAPI, Apache-2.0; Dynamo, Kueue, llm-d, Gateway API CRDs) are read from local clones, not bundled.
- NVIDIA AI Configurator 0.12.0 (Apache-2.0) produced the Pareto frontiers in `datacenter/curves/aic/`; the tool and its measured-kernel databases are installed from PyPI (`aiconfigurator`), not bundled.
